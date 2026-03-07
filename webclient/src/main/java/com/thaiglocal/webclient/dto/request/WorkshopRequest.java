package com.thaiglocal.webclient.dto.request;

public class WorkshopRequest {
    private String name;
    private String description;
    private String Timetable;
    private Double price;
    private Integer MemberCapacity;

    public WorkshopRequest() {}

    public WorkshopRequest(String name, String description, String Timetable, Double price, Integer MemberCapacity) {
        this.name = name;
        this.description = description;
        this.Timetable = Timetable;
        this.price = price;
        this.MemberCapacity = MemberCapacity;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTimetable() { return Timetable; }
    public void setTimetable(String Timetable) { this.Timetable = Timetable;}

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getMemberCapacity() { return MemberCapacity; }
    public void setMemberCapacity(Integer MemberCapacity) { this.MemberCapacity = MemberCapacity; }
}
