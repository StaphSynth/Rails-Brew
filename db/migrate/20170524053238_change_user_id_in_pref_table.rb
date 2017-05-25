class ChangeUserIdInPrefTable < ActiveRecord::Migration[5.0]
  def change
    change_column :user_preferences, :user_id, :integer, unique: true
  end
end
