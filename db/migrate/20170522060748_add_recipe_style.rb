class AddRecipeStyle < ActiveRecord::Migration[5.0]
  def change
    add_column :recipes, :style, :string
  end
end
