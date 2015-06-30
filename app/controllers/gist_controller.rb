class GistController < ApplicationController

  require 'aes'

  def index
    cookies[:presidential_access_tokens] = 'YUTEmbgq+wwDcmm5DlfIsA==$gZvqkXGnSQbWLuwv7zQJdEVMr61zRc466H5eTo9KpXhl8W5zZoBpTlIjrLeh
Gc0lPqjmJ2RDHpx8WHtszXm0/Q=='
    access_token = get_access_token_from_cookie('github')

    if access_token.present?
      client = Octokit::Client.new(:access_token => access_token)
      @github_user = client.user
      @gists = @github_user.rels[:gists]
      render :index
    else
      redirect_to '/oauth/authorize'
    end
  end

  private 

  def get_access_token_from_cookie(service)
    access_tokens = cookies[:presidential_access_tokens]
    access_token = nil

    if access_tokens.present?
      begin
        unencrypted_tokens = AES.decrypt(access_tokens, ENV['PRESIDENTIAL_AES_KEY'])
        json_tokens = JSON.parse(unencrypted_tokens)

        if json_tokens.present? && json_tokens[service].present?
          access_token = json_tokens[service]
        end
      rescue
      end
    end

    access_token
  end
end
