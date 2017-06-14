class SetDefaultEfficiency < ActiveRecord::Migration[5.0]
  def change
    change_column :user_preferences, :default_efficiency, :integer, default: 75
  end
end
