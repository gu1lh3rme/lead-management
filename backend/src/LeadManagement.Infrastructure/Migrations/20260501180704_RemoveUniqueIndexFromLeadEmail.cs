using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LeadManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUniqueIndexFromLeadEmail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Leads_Email",
                table: "Leads");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Leads_Email",
                table: "Leads",
                column: "Email",
                unique: true);
        }
    }
}
