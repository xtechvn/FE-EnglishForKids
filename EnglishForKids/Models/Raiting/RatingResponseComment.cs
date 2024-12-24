using System;
using System.Collections.Generic;

namespace EnglishForKids.Models.Raiting;

public partial class RatingResponseComment
{
    public int Id { get; set; }

    public int? RaitingId { get; set; }
    public string Comment { get; set; }

    public int? UserId { get; set; }
    public string? UserName { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }
}
