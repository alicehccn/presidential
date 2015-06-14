class OauthController < ApplicationController

  require 'uri'
  require 'net/http'
  require 'pry'

  def authorize
    @github_authorization_link = generate_github_oauth_authorization_link
    render :authorize
  end

  def callback
    session_code = request.env['rack.request.query_hash']['code']

    # # ... and POST it back to GitHub
    # result = RestClient.post('https://github.com/login/oauth/access_token',
    #                         {:client_id => CLIENT_ID,
    #                          :client_secret => CLIENT_SECRET,
    #                          :code => session_code},
    #                          :accept => :json)

    # # extract the token and granted scopes
    # access_token = JSON.parse(result)['access_token']

    params = {
      'client_id' => ENV['GITHUB_CLIENT_ID'],
      'client_secret' => ENV['GITHUB_CLIENT_SECRET'],
      'code' => session_code,
      'accept' => :json
    }

    response = Net::HTTP.post_form(
      URI.parse('https://github.com/login/oauth/access_token'),
      params
    )

    puts response.body
  end

  private

  def github_permissions
    'gist'
  end

  def generate_github_oauth_authorization_link
    link = '<a href="'
    link << 'https://github.com/login/oauth/authorize?scope='
    link << "#{github_permissions}&"
    link << "client_id=#{ENV['GITHUB_CLIENT_ID']}"
    link << '">'
    link << "Authorize"
    link << "</a>"
    link
  end
end
