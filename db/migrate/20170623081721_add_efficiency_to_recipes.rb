class AddEfficiencyToRecipes < ActiveRecord::Migration[5.0]
  def change
    add_column :recipes, :efficiency, :integer
  end
end
