package com.thaiglocal.webclient.dto.request;

public class CenterRequest {
    private String name;
    private String address;
    private String tel;
    private String email;
    private String line;
    private String facebook;
    private String website;
    private String createAt;
    private String deleteAt;
    private String leaderFirstName;
    private String leaderLastName;
    private String leaderTel;

    public CenterRequest() {}

    public CenterRequest(String name, String address, String tel, String email, String line, String facebook, String website, String createAt, String deleteAt, String leaderFirstName, String leaderLastName, String leaderTel) {
        this.name = name;
        this.address = address;
        this.tel = tel;
        this.email = email;
        this.line = line;
        this.createAt = createAt;
        this.deleteAt = deleteAt;
        this.facebook = facebook;
        this.website = website;
        this.leaderFirstName = leaderFirstName;
        this.leaderLastName = leaderLastName;
        this.leaderTel = leaderTel;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getTel() { return tel; }
    public void setTel(String tel) { this.tel = tel; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLine() { return line; }
    public void setLine(String line) { this.line = line; }

    public String getFacebook() { return facebook; }
    public void setFacebook(String facebook) { this.facebook = facebook; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getCreateAt() { return createAt; }
    public void setCreateAt(String createAt) { this.createAt = createAt; }

    public String getDeleteAt() { return deleteAt; }
    public void setDeleteAt(String deleteAt) { this.deleteAt = deleteAt; }

    public String getLeaderFirstName() { return leaderFirstName; }
    public void setLeaderFirstName(String leaderFirstName) { this.leaderFirstName = leaderFirstName; }

    public String getLeaderLastName() { return leaderLastName; }
    public void setLeaderLastName(String leaderLastName) { this.leaderLastName = leaderLastName; }

    public String getLeaderTel() { return leaderTel; }
    public void setLeaderTel(String leaderTel) { this.leaderTel = leaderTel; }

}
