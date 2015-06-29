module OauthHelper

  def github_permissions
    'gist'
  end

  def generate_github_oauth_authorization_url
    link = 'https://github.com/login/oauth/authorize?scope='
    link << "#{github_permissions}&"
    link << "client_id=#{ENV['GITHUB_CLIENT_ID']}"
    link
  end
end
