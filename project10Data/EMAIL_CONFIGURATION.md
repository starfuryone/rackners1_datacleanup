# Email Configuration - DataCleanup Pro

## Mail Server Details
- **Server:** root@157.245.189.135 (mail.datacleanup.pro)
- **Mail System:** Postfix
- **Domain:** datacleanup.pro

## Configured Email Addresses

All emails are forwarded to the `frederic` mailbox on mail.datacleanup.pro:

### Legal & Compliance Emails
- `info@datacleanup.pro` - General inquiries
- `legal@datacleanup.pro` - Legal inquiries
- `compliance@datacleanup.pro` - EU Regulation 2021/784 compliance contact
- `dsa-authorities@datacleanup.pro` - DSA (Regulation 2022/2065) authorities contact
- `support@datacleanup.pro` - Customer support

### Catch-All Wildcard
- `*@datacleanup.pro` - Any email to any address @datacleanup.pro is forwarded to frederic

## Configuration Files

### /etc/postfix/virtual
```
# Specific email addresses for legal compliance
info@datacleanup.pro          frederic
legal@datacleanup.pro         frederic
compliance@datacleanup.pro    frederic
dsa-authorities@datacleanup.pro frederic
support@datacleanup.pro       frederic

# Catch-all for any other email to @datacleanup.pro
@datacleanup.pro              frederic
```

### /etc/postfix/main.cf (relevant settings)
```
myhostname = mail.datacleanup.pro
mydomain = datacleanup.pro
virtual_alias_maps = hash:/etc/postfix/virtual
```

## Testing Email Configuration

Test the catch-all by sending to any address:
```bash
echo "Test email" | mail -s "Test" test123@datacleanup.pro
echo "Test email" | mail -s "Test" legal@datacleanup.pro
```

Check received mail:
```bash
ssh root@157.245.189.135 "cat /var/mail/frederic"
```

## Maintenance

After making changes to `/etc/postfix/virtual`:
```bash
ssh root@157.245.189.135 "postmap /etc/postfix/virtual && systemctl reload postfix"
```

Verify configuration:
```bash
ssh root@157.245.189.135 "postfix check"
```

## Status
- ✅ Catch-all configured: All emails to *@datacleanup.pro forward to frederic
- ✅ Legal emails configured: info@, legal@, compliance@, dsa-authorities@, support@
- ✅ Postfix validated and reloaded
- ✅ Configuration active as of October 2, 2025
