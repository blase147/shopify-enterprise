class ScanCustomersNotHavingContractsWorker
    include Sidekiq::Worker
    sidekiq_options :retry => 3, :dead => false
    def perform(file_path)
        require 'roo'
        sheet = Roo::Excelx.new(file_path, file_warning: :ignore)
        File.open('customers_not_having_contract.xlsx','w') do |file|
            (1..sheet.last_row).each do |row|
                record = sheet.row(row)
                contract = CustomerSubscriptionContract.find_by_email("#{record[4]}".strip) rescue nil
                unless contract.present?                    
                    file.puts record.join(",")
                end
            end
        end
    end
end