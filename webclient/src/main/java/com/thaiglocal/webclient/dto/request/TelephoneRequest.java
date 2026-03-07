package com.thaiglocal.webclient.dto.request;

public class TelephoneRequest {
    private String telNumber;
    private Long centerId;

    public TelephoneRequest() {}

    public TelephoneRequest(String telNumber, Long centerId) {
        this.telNumber = telNumber;
        this.centerId = centerId;
    }

    public String getTelNumber() { return telNumber; }
    public void setTelNumber(String telNumber) { this.telNumber = telNumber; }

    public Long getCenterId() { return centerId; }
    public void setCenterId(Long centerId) { this.centerId = centerId; }


}
