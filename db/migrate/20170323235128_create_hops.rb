class CreateHops < ActiveRecord::Migration[5.0]
  def change
    create_table :hops do |t|
      t.string :name
      t.string :use
      t.string :origin
      t.float :aa
      t.text :description

      t.timestamps
    end
  end
end
