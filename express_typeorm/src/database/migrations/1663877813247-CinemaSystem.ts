import { MigrationInterface, QueryRunner } from "typeorm";

export class CinemaSystem1663877813247 implements MigrationInterface {
  /**
   # ToDo: Create a migration that creates all tables for the following user stories

   For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
   To not introduce additional complexity, please consider only one cinema.

   Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.

   ## User Stories

   **Movie exploration**
   * As a user I want to see which films can be watched and at what times
   * As a user I want to only see the shows which are not booked out

   **Show administration**
   * As a cinema owner I want to run different films at different times
   * As a cinema owner I want to run multiple films at the same time in different showrooms

   **Pricing**
   * As a cinema owner I want to get paid differently per show
   * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat

   **Seating**
   * As a user I want to book a seat
   * As a user I want to book a vip seat/couple seat/super vip/whatever
   * As a user I want to see which seats are still available
   * As a user I want to know where I'm sitting on my ticket
   * As a cinema owner I dont want to configure the seating for every show
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create tables
    await queryRunner.query(`
      CREATE TABLE cinema (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );

      CREATE TABLE film (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        duration INTERVAL NOT NULL,
        description TEXT
      );

      CREATE TABLE room (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        capacity INT NOT NULL,
        cinema_id INT NOT NULL REFERENCES cinema(id)
      );

      CREATE TABLE show (
        id SERIAL PRIMARY KEY,
        start_time TIMESTAMP NOT NULL,
        film_id INT NOT NULL REFERENCES film(id),
        room_id INT NOT NULL REFERENCES room(id)
      );

      CREATE TABLE pricing (
        id SERIAL PRIMARY KEY,
        show_id INT NOT NULL REFERENCES show(id),
        price DECIMAL(10, 2) NOT NULL,
        seat_type TEXT NOT NULL
      );

      CREATE TABLE seat (
        id SERIAL PRIMARY KEY,
        row INT NOT NULL,
        number INT NOT NULL,
        room_id INT NOT NULL REFERENCES room(id)
      );

      CREATE TABLE booking (
        id SERIAL PRIMARY KEY,
        show_id INT NOT NULL REFERENCES show(id),
        seat_id INT NOT NULL REFERENCES seat(id),
        user_name TEXT NOT NULL,
        user_email TEXT NOT NULL
      );
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX idx_show_start_time ON show(start_time);
      CREATE INDEX idx_pricing_show_id ON pricing(show_id);
      CREATE UNIQUE INDEX idx_seat_row_number_room_id ON seat(row, number, room_id);
      CREATE UNIQUE INDEX idx_booking_show_id_seat_id ON booking(show_id, seat_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE booking;
      DROP TABLE seat;
      DROP TABLE pricing;
      DROP TABLE show;
      DROP TABLE room;
      DROP TABLE film;
      DROP TABLE cinema;
    `);

    // Drop indexes
    await queryRunner.query(`
      DROP INDEX idx_show_start_time;
      DROP INDEX idx_pricing_show_id;
      DROP INDEX idx_seat_row_number_room_id;
      DROP INDEX idx_booking_show_id_seat_id;
    `);
  }
}
