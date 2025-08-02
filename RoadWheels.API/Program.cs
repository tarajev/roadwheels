
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using RoadWheels.API.Models;
using RoadWheels.API.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddMvc();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDirectoryBrowser();


builder.Services.AddCors(options =>
    {
        options.AddPolicy("CORS", policy =>
        {
            policy.AllowAnyHeader()
                  .AllowAnyMethod()
                  .WithOrigins("http://localhost:5500", // TODO: Srediti CORS.
                            "https://localhost:5500",
                            "http://127.0.0.1:5500",
                            "https://127.0.0.1:5500",
                            "http://localhost:3000",
                            "https://localhost:3000",
                            "http://192.168.56.1:3000",
                            "http://127.0.0.1:3000",
                            "https://127.0.0.1:3000")
                  .AllowCredentials();
        });
    });

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]))
        };
    });

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "RoadWheels API", Version = "v1" });

    //jwt autorizacija
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Unesite JWT token u formatu: Bearer {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.Configure<RoadWheelsDatabaseSettings>(builder.Configuration.GetSection("MongoDB"));

builder.Services.AddSingleton<IMongoClient>(s =>
    new MongoClient(builder.Configuration.GetSection("MongoDB")["ConnectionString"]));

builder.Services.AddSingleton<IMongoDatabase>(s =>
{
    var client = s.GetRequiredService<IMongoClient>();
    var settings = s.GetRequiredService<IOptions<RoadWheelsDatabaseSettings>>();
    return client.GetDatabase(settings.Value.DatabaseName);
});
var mongoSettings = builder.Configuration.GetSection("MongoDB").Get<RoadWheelsDatabaseSettings>();
Console.WriteLine($"MongoDB ConnectionString: {mongoSettings.ConnectionString}");
Console.WriteLine($"MongoDB DatabaseName: {mongoSettings.DatabaseName}");

builder.Services.AddScoped<VehicleService>();
builder.Services.AddScoped<CountryService>();
builder.Services.AddScoped<ReservationService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();

app.UseRouting();

app.UseCors("CORS");

app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();

app.MapControllers();
app.MapControllers();

app.Run();
