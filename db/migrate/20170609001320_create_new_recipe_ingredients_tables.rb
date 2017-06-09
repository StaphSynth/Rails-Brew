class CreateNewRecipeIngredientsTables < ActiveRecord::Migration[5.0]
  def change
    create_table :recipe_malts do |t|
      t.integer :recipe_id
      t.string :malt
      t.float :quantity
    end

    create_table :recipe_hops do |t|
      t.integer :recipe_id
      t.string :hop
      t.float :quantity
    end

    create_table :recipe_yeasts do |t|
      t.integer :recipe_id
      t.string :yeast
    end

    create_table :recipe_adjuncts do |t|
      t.integer :recipe_id
      t.string :adjunct
    end
  end
end
