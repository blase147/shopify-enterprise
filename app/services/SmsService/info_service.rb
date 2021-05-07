class SmsService::InfoService
  def initialize(conversation, params)
    @conversation = conversation
    @params = params
    @shared_service = SmsService::SharedService.new(conversation, params)
  end

  def info_data
    if @conversation.command_step == 1
      message = SmsConversation.info_commands.each_with_index.map{ |command, i| "#{i+1}. #{command[0]}: #{command[1]}" }.join('/n')
      @shared_service.create_sms_message(message, @conversation.command_step)
      @shared_service.send_message(message)
    else
      @shared_service.send_message('Please send appropriate command.')
    end
  end
end
