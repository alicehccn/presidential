module PresidentialHelper

  def username_or_email(user)
    if user.username.present?
      user.username
    else
      user.email
    end
  end
end
