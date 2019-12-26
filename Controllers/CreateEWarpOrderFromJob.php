<?php

namespace App\eWarpIntegration\Jobs;

use App\eWarpIntegration\Exceptions\NoMaterialsForJobException;
use App\eWarpIntegration\Exceptions\eWarpErrorResponseException;

use App\eWarpIntegration\Jobs\AddMaterialsForJob;
use App\Jobs\Job;
use App\AllJob as JobModel;
use App\Order;
use App\EwarpLog;

use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

use Illuminate\Support\Facades\App;
use Log;
use Illuminate\Support\Facades\Config;
use App\Events\EwarpPlaceOrderFail;
use Event;

/**
 *
 * @author Esteban Zeller <esteban@serfe.com>
 * @since 0.2
 * @package App
 * @subpackage eWarpIntegration
 */
class CreateEWarpOrderFromJob extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels, Dispatchable;

    /**
     * Job that generates the upload request
     *
     * @var integer
     */
    public $job_id;

    /**
     * Pointer to the eWarp integration
     *
     * @var type
     */
    public $eWarp = null;


    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($job_id)
    {
        $this->job_id = $job_id;
        $this->eWarp = App::make('ewarp');
    }

    /**
     * Execute the job.
     *
     * Send an email to the user for account verified
     *
     * @return void
     */
    public function handle()
    {


        $job = JobModel::find($this->job_id);
        $job_asset = $job->assetType;        
        $batch_id = null;

        // If there is no eWarp Product ID the job will be done manually.
        if ($job_asset && !is_null($job_asset->ewarp_product_id)) {
            // Get all files listings
            $order = $this->eWarp->createOrder();
            $order->setReference(intval($job->order_id));

            $job_product_line_map = [];

            $ph_email = '';
            if ($job->photographer) {
                $photographer = $job->photographer;

                if ($photographer && $photographer->User->email) {
                    $ph_email = "Photographer email contact: " . $photographer->User->email;
                }
            } else {
                Log::error("The job" . $job->id . " has no photographer assigned");
            }

            // Get the amount of files
            $orderLine = $order->getLine();
            $amount = $job->quantity;
            if ($amount == 0) {
                throw new NoMaterialsForJobException("The job ".$job->id." has no amount of converted files setted");
            }
            $orderLine->quantity    = $amount;
            $orderLine->variant1    = $job_asset->variant_1;
            $orderLine->productId   = $job_asset->ewarp_product_id;
            $orderLine->unit        = $job_asset->unit;
            //comments must be an array: [comment1,comment2...]
            $orderLine->comments    = [$job->comments];
            if ($ph_email !== '') {
                $orderLine->comments[] = $ph_email;
            }

            $job_product_line_map[$job_asset->ewarp_product_id][$job_asset->variant_1] = $job->id;

            try {

              // dd($order);
                $response = $this->eWarp->placeOrder($order);
               
            } catch (eWarpErrorResponseException $e) {

                pr($e->getMessage());
                EwarpLog::addEwarpLog($e->getMessage(), $this->job_id, "eWarp order placed failed");
                if ($this->attempts() >= 5) {
                    $this->failed();
                } else {
                    $this->release(pow(15*$this->attempts(), 2));
                }
                // throw $e;
                return;
            }

            if ($response !== false) {
                $ewarp_data['sentData'] = $order->convert();
                $ewarp_data['responseData'] = $response;

                if ($job->send_to_ewarp_by_su) {
                    $ewarp_data['finishUpload'] = 'The job was sent to ewarp by SU';
                } else {
                    $ewarp_data['finishUpload'] = 'The job was sent to ewarp by Photographer';
                }

                EwarpLog::addEwarpLog($ewarp_data, $this->job_id, "eWarp order placed");

                $batch_id = intval($response['orderLines'][0]['batchId']);

                $job->batch_id = $batch_id;
                $job->save();

                // Save the batch id also inside the files
                $mediafiles = $job->mediafiles()->get();
                foreach ($mediafiles as $mediafile) {
                    $mediafile->batch_id = $batch_id;
                    $mediafile->save();
                }

                //$bgjob = (new AddMaterialsForJob($job->id))->onQueue(Config::get('aws.sqs.ewarp'));
                dispatch((new AddMaterialsForJob($job->id))->onQueue(Config::get('aws.sqs.ewarp')));
                //$this->dispatch($bgjob);
            } else {
                EwarpLog::addEwarpLog("There was an error when trying to place the eWarp Order", $this->job_id, "eWarp order placed failed");
                throw new Exception("There was an error when triying to place the eWarp Order");
            }
        } else {
            // manual job - Will be completed by SU
            $job->status = JobModel::$status['assigned']['key'];
            $job->save();

            EwarpLog::addEwarpLog("This job does not have an asset type with eWarp ID. Will not return a batch ID", $this->job_id, "eWarp order placed");
        }

        // if order has all manual jobs, equally is seted as placed to indicate that is has been processed
        $original_order = Order::find($job->order_id);
        $original_order->ewarp_order_placed = true;
        $original_order->save();

        return $batch_id;
    }

    /**
     *
     */
    public function failed()
    {

            Log::info("Place order on eWarp failed more than ".$this->attempts()." times for job #".$this->job_id.". Sending email notification.");
        if ($this->attempts() >= 5) {
            Event::fire(new EwarpPlaceOrderFail([
                'job_id' => $this->job_id,
                'attempts' => $this->attempts(),
            ]));
            EwarpLog::addEwarpLog(
                "The system has given up trying to place the order on eWarp after 5 retries for job #".$this->job_id.". Check the logs and retry from the admin interface.",
                $this->job_id,
                "eWarp order placing gives up!"
            );

            // Reset the flag to allow manual placing
            $job = JobModel::find($this->job_id);
            $job->already_queued = 0;
            $job->save();
        }
    }
}
