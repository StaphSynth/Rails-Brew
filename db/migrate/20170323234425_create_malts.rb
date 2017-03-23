class CreateMalts < ActiveRecord::Migration[5.0]
  def change
    create_table :malts do |t|
      t.string :name
      t.string :type
      t.string :use
      t.float :EBC
      t.float :GPK
      t.text :description

      t.timestamps
    end
  end
end
