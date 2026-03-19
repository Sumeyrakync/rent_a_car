using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace rent_a_car.Migrations
{
    /// <inheritdoc />
    public partial class HasarDurumu : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rentals_Rentals_RentalId",
                table: "Rentals");

            migrationBuilder.DropIndex(
                name: "IX_Rentals_RentalId",
                table: "Rentals");

            migrationBuilder.DropColumn(
                name: "RentalId",
                table: "Rentals");

            migrationBuilder.AddColumn<bool>(
                name: "IsDamaged",
                table: "Cars",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDamaged",
                table: "Cars");

            migrationBuilder.AddColumn<int>(
                name: "RentalId",
                table: "Rentals",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rentals_RentalId",
                table: "Rentals",
                column: "RentalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Rentals_Rentals_RentalId",
                table: "Rentals",
                column: "RentalId",
                principalTable: "Rentals",
                principalColumn: "Id");
        }
    }
}
