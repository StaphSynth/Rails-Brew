class AddViewsToRecipe < ActiveRecord::Migration[5.0]
  def change
    add_column :recipes, :views, :integer, :default => 0
  end
end
