module UsersHelper

  #returns inner HTML text for the user account submit button
  def submit_wording(mode)
    if mode == :edit
      return 'Update'
    elsif mode == :new
      return 'Create'
    end
  end
end
