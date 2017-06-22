class ModifyWeightPrefs < ActiveRecord::Migration[5.0]
  def change
    rename_column :user_preferences, :weight, :malt_weight
  end
end
