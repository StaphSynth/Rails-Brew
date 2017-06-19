class AddDefaultBatchVolumeToUserPreferences < ActiveRecord::Migration[5.0]
  def change
    add_column :user_preferences, :default_batch_volume, :decimal, default: 22
  end
end
