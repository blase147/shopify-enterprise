class RedisService
    def initialize
        $redis = Redis.new
    end

    def set(key,val,_options=nil)
        if _options.present?
            return $redis.set(key, val.to_json,options = _options) 
        else
            return $redis.set(key, val.to_json)
        end
    end

    def get(key)
        data = JSON.parse($redis.get(key)) rescue nil
        return data
    end

    def del(key)
        $redis.del(key)
    end
end