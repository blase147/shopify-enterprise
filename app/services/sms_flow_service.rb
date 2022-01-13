class SmsFlowService
  def initialize(sms_flow)
    @sms_flow = sms_flow
  end

  def process_flow(node = nil, index = 0)
    if @sms_flow.present?
      content = @sms_flow.content
      content.drop(index).each_with_index do |data, index|
        if data['type'] == 'conditional'
          # write what should happen when condition is here, and remove next

          next
        elsif data['type'] == 'delay'
          # write what should happen when delay is here, and remove next

          if data['nodeData']
            interval = data['nodeData']['interval']
            duration = data['nodeData']['duration']

            SmsFlowDelayWorker.perform_in("#{duration}.#{interval}", @sms_flow, nil, +1) #this is job for Delay
            break
          end
          next
        elsif data['type'] == 'action'
          action_type = data['nodeData']['title']

          send_message = TwilioServices::SendSms new({to: '', from: '', message: data['nodeData']['message'] })
          send_message.send_message

          # if action_type == "SMS message"
          #   # SEND SMS MESSAGE HERE
          # elsif action_type == "MMS message"
          #   # SEND MMS MESSAGE HERE
          # elsif action_type == "SMS/MMS WITH RESPONSES"
          #   # SEND MMS MESSAGE HERE
          # elsif action_type == "ADD TO LIST"
          #   # SEND MMS MESSAGE HERE
          # elsif action_type == "SEND SLACK NOTIFICATION"
          #   # SEND MMS MESSAGE HERE
          # end

        elsif data['type'] == 'end'
          # write what should happen when end is here, and remove next

          next
        end
      end
    end
  end
end
