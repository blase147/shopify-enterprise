class SmsService::ProcessService
  def process
    payload = process_message(@conversation.command_step)
    @response = @shared_service.send_message(payload[:message])
    if !@response[:error_message].present?
      if payload[:error].present?
        @conversation.update(command_step: @conversation.command_step - 1)
      else
        @shared_service.create_sms_message(payload[:message], payload[:increase_step])
        @conversation.update(command_step: payload[:increase_step])
      end
    else
      puts "######### ERROR: #{@response[:error_message]} #########"
    end
  end
end
