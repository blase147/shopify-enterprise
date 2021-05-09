class SmsConversation < ApplicationRecord
  belongs_to :customer
  has_many :sms_messages

  enum status: [:ongoing, :expired, :stoped]

  def self.commands
    {
      'STOP': 'Stops the current conversation.',
      'SWAP': 'Enables you the change your subscription product for another one.',
      'SKIP': 'Enables you to skip your next shipment.',
      'DELAY': 'Enables you to delay your next shipment.',
      'QUANTITY': 'Enables you to change the quantity of products you are currently receiving.',
      'BILLING': 'Enables you to change your billing information.',
      'SHIPPING': 'Enables you to change your shipping information.',
      'PRODUCT': 'Enables you to add a product to your next shipment.',
      'CANCEL': 'Enables you to cancel your subscription at any time.',
      'PAUSE': 'Enables you to pause your subscription.',
      'RESUME': 'Enables you to resume your paused subscription.',
      'INFO': 'List all available commands.',
      'END': 'Stops the current conversation.'
    }
  end

  def self.info_commands
    SmsConversation.commands.except(:END, :INFO)
  end
end
