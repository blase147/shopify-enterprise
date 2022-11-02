class CalculateShopifyWaitTime
    def self.calculate_wait_time(cost)
        requested = cost["actualQueryCost"] || cost["requestedQueryCost"]
        restore_amount = requested - cost["throttleStatus"]["currentlyAvailable"]
        wait_time = (restore_amount/cost["throttleStatus"]["restoreRate"])*1000
        wait_time = wait_time > 0 ? wait_time&.ceil : 0
    end
end