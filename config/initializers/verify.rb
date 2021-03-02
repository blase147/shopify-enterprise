module JWT
  # JWT verify methods
  class Verify
    def verify_not_before
      return unless @payload.include?('nbf')
      #raise(JWT::ImmatureSignature, 'Signature nbf has not been reached') if @payload['nbf'].to_i > (Time.now.to_i + nbf_leeway)
    end
  end
end