class AddColumnsToRecipeTable < ActiveRecord::Migration[5.0]
  def change
    add_column :recipes, :batch_volume, :decimal
    add_column :recipes, :OG, :decimal
    add_column :recipes, :FG, :decimal
    add_column :recipes, :colour, :decimal
  end
end
