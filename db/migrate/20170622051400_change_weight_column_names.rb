class ChangeWeightColumnNames < ActiveRecord::Migration[5.0]
  def change
    rename_column :user_preferences, :hop_weight, :weight_small
    rename_column :user_preferences, :malt_weight, :weight_big
  end
end
