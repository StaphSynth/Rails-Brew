class AddEfficiencyColumnToRecipes < ActiveRecord::Migration[5.0]
  def change
    add_column :recipes, :efficiency, :integer
    add_column :user_preferences, :default_efficiency, :integer
  end
end
