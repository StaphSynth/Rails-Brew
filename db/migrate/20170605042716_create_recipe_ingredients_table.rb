class CreateRecipeIngredientsTable < ActiveRecord::Migration[5.0]
  def change
    create_table :recipe_ingredients do |t|
      t.integer :recipe_id, null: false
      t.string :ingredient, null: false
      t.float :quantity, null: false
    end
  end
end
