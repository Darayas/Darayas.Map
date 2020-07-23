using Microsoft.EntityFrameworkCore.Migrations;

namespace Darayas.Maps.DAL.Migrations
{
    public partial class mig2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tblPalceCategoris",
                columns: table => new
                {
                    Id = table.Column<string>(maxLength: 150, nullable: false),
                    ImgName = table.Column<string>(maxLength: 150, nullable: false),
                    Title = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblPalceCategoris", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tblPalces",
                columns: table => new
                {
                    Id = table.Column<string>(maxLength: 150, nullable: false),
                    CateId = table.Column<string>(maxLength: 150, nullable: false),
                    Name = table.Column<string>(maxLength: 150, nullable: false),
                    Lat = table.Column<string>(maxLength: 150, nullable: false),
                    Lng = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblPalces", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblPalces_tblPalceCategoris_CateId",
                        column: x => x.CateId,
                        principalTable: "tblPalceCategoris",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tblPalces_CateId",
                table: "tblPalces",
                column: "CateId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tblPalces");

            migrationBuilder.DropTable(
                name: "tblPalceCategoris");
        }
    }
}
