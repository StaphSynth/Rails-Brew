class AddHopWeightToPrefs < ActiveRecord::Migration[5.0]
  def change
    add_column :user_preferences, :hop_weight, :string
  end
end
