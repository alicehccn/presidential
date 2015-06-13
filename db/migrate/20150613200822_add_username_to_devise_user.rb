class AddUsernameToDeviseUser < ActiveRecord::Migration
  def up
    change_table(:users) do |t|
      t.string :username, null: false
    end
  end
  def down
    change_table(:users) do |t|
      t.remove :username
    end
  end
end
