class AddLimitsToUserpref < ActiveRecord::Migration[5.0]
  def change
    change_column :user_preferences, :hop_weight, :string, {:limit => 1, :null => false}
  end
end
