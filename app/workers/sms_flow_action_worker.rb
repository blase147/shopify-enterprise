class SmsFlowActionWorker
  include Sidekiq::Worker

  def perform(sms_flow = nil, node = nil)

    # write the functionality for the delay job here
    SmsFlowService.new(sms_flow).process_flow(node,index) # this will continue the sms flow service from where it left
  end
end
