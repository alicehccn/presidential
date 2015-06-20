class OauthController < ApplicationController

  require 'uri'
  require 'net/http'
  require 'json'

  def authorize
    @github_authorization_link = generate_github_oauth_authorization_link
    render :authorize
  end

  def callback

    session_code = request.env['rack.request.query_hash']['code']

    access_token_response = request_github_access_token(session_code)

    begin
      access_token = JSON.parse(access_token_response.body)['access_token']
    rescue
      access_token = nil
    end

    if access_token.present?
      session[:github_access_token] = access_token
      redirect_to '/gists'
    else
      @github_oauth_errors = access_token_response
      render :github_oauth_error
    end
    
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

  def request_github_access_token(session_code)
    uri = URI.parse('https://github.com/login/oauth/access_token')

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(
      uri.request_uri,
      initheader = {
        'Content-Type' =>'application/json',
        'Accept' => 'application/json'
      }
    )
    request.body = {
      'client_id' => ENV['GITHUB_CLIENT_ID'],
      'client_secret' => ENV['GITHUB_CLIENT_SECRET'],
      'code' => session_code,
    }.to_json

    http.request(request)
  end

end
