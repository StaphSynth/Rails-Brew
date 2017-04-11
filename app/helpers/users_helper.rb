module UsersHelper

  #returns inner HTML text for the user account submit button
  def submit_wording(mode)
    if mode == :edit
      return 'Update'
    elsif mode == :new
      return 'Create'
    end
  end

  #returns gravatar <img> tag for given user
  #accepts 'small', 'med', 'large' size args for <img> class
  def get_gravatar(user, size)
    gravatar_id = Digest::MD5::hexdigest(user.email.downcase)
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}"
    image_tag(gravatar_url, alt: "#{user.name} avatar", class: "avatar avatar-#{size}")
  end
end
