class GistController < ApplicationController

  def index
    access_token = session[:github_access_token]

    if access_token.present?
      client = Octokit::Client.new(:access_token => access_token)
      @github_user = client.user
      @gists = @github_user.rels[:gists]
      render :index
    else
      redirect_to '/oauth/authorize'
    end
  end
end
