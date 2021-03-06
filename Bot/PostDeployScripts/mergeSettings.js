const fs = require('fs');
const path = require('path');
const appSettingPath = path.resolve('./appsettings.json');
const envPath = path.resolve('./.env');

const settings = readSettingsFile(appSettingPath, envPath);
const env = process.env;

const envNames = Object.keys(env)
    .filter(function(x){ return x.indexOf("APPSETTING_") === 0;})
    .filter(function(x){ return x.indexOf("APPSETTING_WEBSITE_") < 0; });
const appSettings = envNames.reduce(function(cur, key) { return {...cur, [key.substring(11)]: env[key]};}, {});

const newSettings = {...settings, ...appSettings};

updateSettingsFile(appSettingPath, envPath, newSettings);

function readDotEnv(file) {
    const text = fs.readFileSync(file, 'utf-8');
    const lines = text.split(/[\r\n]/);
    const settings = lines.reduce(function(cur, line) {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const name = parts.splice(0, 1);
            cur[name] = parts.join('=');
        }
        return cur;
    }, {});

    return settings;
}

function readSettingsFile(appSettingPath, envPath) {
    if (fs.existsSync(appSettingPath)) {
        return JSON.parse(fs.readFileSync(appSettingPath, 'utf-8'));
    }

    if (fs.existsSync(envPath)) {
        return readDotEnv(envPath);
    }

    return {};
}

function isNodeJSProject() {
    return fs.existsSync(path.resolve('./iisnode.yml'));
}

function updateSettingsFile(appSettingPath, envPath, settings) {
    if (isNodeJSProject()) {
        const keys = Object.keys(settings);
        const lines = keys.reduce(function(cur, key) {
            return [...cur, key + '=' + settings[key]];
        }, []);
        fs.writeFileSync(envPath, lines.join('\n'), {encoding: 'utf-8'});
    } else {
        fs.writeFileSync(appSettingPath, JSON.stringify(settings, null, 2), {encoding: 'utf-8'});
    }
}

// SIG // Begin signature block
// SIG // MIIrWQYJKoZIhvcNAQcCoIIrSjCCK0YCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // ABXngb6XfFVrkpPEfinEWsWVGwpaJVzPO8g3ChQgKQag
// SIG // ghF5MIIIiTCCB3GgAwIBAgITNgAAAX7/b/0EpCVYEgAC
// SIG // AAABfjANBgkqhkiG9w0BAQsFADBBMRMwEQYKCZImiZPy
// SIG // LGQBGRYDR0JMMRMwEQYKCZImiZPyLGQBGRYDQU1FMRUw
// SIG // EwYDVQQDEwxBTUUgQ1MgQ0EgMDEwHhcNMjEwOTA5MDEy
// SIG // NjI2WhcNMjIwOTA5MDEyNjI2WjAkMSIwIAYDVQQDExlN
// SIG // aWNyb3NvZnQgQXp1cmUgQ29kZSBTaWduMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkIdczHOhlavX
// SIG // 8oArJKfzvYOo0tIpSd4nZs/tiZBPvQGqzNAIidfwg0BE
// SIG // 0l+eiTofVZvJHX343aiXw9jaEldpTtXigBShEysoiSr2
// SIG // 3Ft/B+yYR9YfsggY2o4lssHAGf4qUV97DGDOZ15efhsR
// SIG // GaRkGyyLKy49uGYvXY9pHR3NA8am3ps5Qskogfp/axxX
// SIG // YvcxJ+l87k3/94ulzN+pVD2fsbemXJLqbtAgJ7uHWa9V
// SIG // 4sB72yb6qt0XFzlOY6dZvwCpODr/vY2hCjp2IhyW56Qv
// SIG // rysf2b/GmWo4T8lWN312/7coBjsm+tOxGJ+xdr+AHCS+
// SIG // aHD009wRlrb3tSrjsEUbNwIDAQABo4IFlTCCBZEwKQYJ
// SIG // KwYBBAGCNxUKBBwwGjAMBgorBgEEAYI3WwEBMAoGCCsG
// SIG // AQUFBwMDMD0GCSsGAQQBgjcVBwQwMC4GJisGAQQBgjcV
// SIG // CIaQ4w2E1bR4hPGLPoWb3RbOnRKBYIPdzWaGlIwyAgFk
// SIG // AgEMMIICdgYIKwYBBQUHAQEEggJoMIICZDBiBggrBgEF
// SIG // BQcwAoZWaHR0cDovL2NybC5taWNyb3NvZnQuY29tL3Br
// SIG // aWluZnJhL0NlcnRzL0JZMlBLSUNTQ0EwMS5BTUUuR0JM
// SIG // X0FNRSUyMENTJTIwQ0ElMjAwMSgyKS5jcnQwUgYIKwYB
// SIG // BQUHMAKGRmh0dHA6Ly9jcmwxLmFtZS5nYmwvYWlhL0JZ
// SIG // MlBLSUNTQ0EwMS5BTUUuR0JMX0FNRSUyMENTJTIwQ0El
// SIG // MjAwMSgyKS5jcnQwUgYIKwYBBQUHMAKGRmh0dHA6Ly9j
// SIG // cmwyLmFtZS5nYmwvYWlhL0JZMlBLSUNTQ0EwMS5BTUUu
// SIG // R0JMX0FNRSUyMENTJTIwQ0ElMjAwMSgyKS5jcnQwUgYI
// SIG // KwYBBQUHMAKGRmh0dHA6Ly9jcmwzLmFtZS5nYmwvYWlh
// SIG // L0JZMlBLSUNTQ0EwMS5BTUUuR0JMX0FNRSUyMENTJTIw
// SIG // Q0ElMjAwMSgyKS5jcnQwUgYIKwYBBQUHMAKGRmh0dHA6
// SIG // Ly9jcmw0LmFtZS5nYmwvYWlhL0JZMlBLSUNTQ0EwMS5B
// SIG // TUUuR0JMX0FNRSUyMENTJTIwQ0ElMjAwMSgyKS5jcnQw
// SIG // ga0GCCsGAQUFBzAChoGgbGRhcDovLy9DTj1BTUUlMjBD
// SIG // UyUyMENBJTIwMDEsQ049QUlBLENOPVB1YmxpYyUyMEtl
// SIG // eSUyMFNlcnZpY2VzLENOPVNlcnZpY2VzLENOPUNvbmZp
// SIG // Z3VyYXRpb24sREM9QU1FLERDPUdCTD9jQUNlcnRpZmlj
// SIG // YXRlP2Jhc2U/b2JqZWN0Q2xhc3M9Y2VydGlmaWNhdGlv
// SIG // bkF1dGhvcml0eTAdBgNVHQ4EFgQUbnzITVXlsHgMhs3R
// SIG // W8ZMWvMtVowwDgYDVR0PAQH/BAQDAgeAMFAGA1UdEQRJ
// SIG // MEekRTBDMSkwJwYDVQQLEyBNaWNyb3NvZnQgT3BlcmF0
// SIG // aW9ucyBQdWVydG8gUmljbzEWMBQGA1UEBRMNMjM2MTY3
// SIG // KzQ2Nzk3NDCCAeYGA1UdHwSCAd0wggHZMIIB1aCCAdGg
// SIG // ggHNhj9odHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtp
// SIG // aW5mcmEvQ1JML0FNRSUyMENTJTIwQ0ElMjAwMSgyKS5j
// SIG // cmyGMWh0dHA6Ly9jcmwxLmFtZS5nYmwvY3JsL0FNRSUy
// SIG // MENTJTIwQ0ElMjAwMSgyKS5jcmyGMWh0dHA6Ly9jcmwy
// SIG // LmFtZS5nYmwvY3JsL0FNRSUyMENTJTIwQ0ElMjAwMSgy
// SIG // KS5jcmyGMWh0dHA6Ly9jcmwzLmFtZS5nYmwvY3JsL0FN
// SIG // RSUyMENTJTIwQ0ElMjAwMSgyKS5jcmyGMWh0dHA6Ly9j
// SIG // cmw0LmFtZS5nYmwvY3JsL0FNRSUyMENTJTIwQ0ElMjAw
// SIG // MSgyKS5jcmyGgb1sZGFwOi8vL0NOPUFNRSUyMENTJTIw
// SIG // Q0ElMjAwMSgyKSxDTj1CWTJQS0lDU0NBMDEsQ049Q0RQ
// SIG // LENOPVB1YmxpYyUyMEtleSUyMFNlcnZpY2VzLENOPVNl
// SIG // cnZpY2VzLENOPUNvbmZpZ3VyYXRpb24sREM9QU1FLERD
// SIG // PUdCTD9jZXJ0aWZpY2F0ZVJldm9jYXRpb25MaXN0P2Jh
// SIG // c2U/b2JqZWN0Q2xhc3M9Y1JMRGlzdHJpYnV0aW9uUG9p
// SIG // bnQwHwYDVR0jBBgwFoAUllGE4Gtve/7YBqvD8oXmKa5q
// SIG // +dQwHwYDVR0lBBgwFgYKKwYBBAGCN1sBAQYIKwYBBQUH
// SIG // AwMwDQYJKoZIhvcNAQELBQADggEBAFNUZq2bELWmMfHQ
// SIG // bvcwusOE1xLbpndztAKz+1tAqO5zRQg07/KcajjNm8/6
// SIG // R+PQ13Z83Fwk41I3IqNN1fkDzt0JfMTjKpvGxPSnKH/n
// SIG // z5OA8g2OcvmM8UMpOPVEZ+Hmt1oYoQCZIP8ZxS4ip21l
// SIG // vIsqsYnvgeOLvXT327Fq8XIHnc0px9Gl8HyLdvSCgqRh
// SIG // y++KwQ2yh13S9KRI3/XNmAOjoktSB+1/7LgYxBWuCxGD
// SIG // 00hStgCV6YDO6vXZkr7WuAsrnUaGH9QVzykfgszU/Vy+
// SIG // WSV/C1LguS62YG7ey845VvtVJqNjrJlDt2AO/7Obx+k6
// SIG // nOrmfYrCMLIrdF36Lh0wggjoMIIG0KADAgECAhMfAAAA
// SIG // UeqP9pxzDKg7AAAAAABRMA0GCSqGSIb3DQEBCwUAMDwx
// SIG // EzARBgoJkiaJk/IsZAEZFgNHQkwxEzARBgoJkiaJk/Is
// SIG // ZAEZFgNBTUUxEDAOBgNVBAMTB2FtZXJvb3QwHhcNMjEw
// SIG // NTIxMTg0NDE0WhcNMjYwNTIxMTg1NDE0WjBBMRMwEQYK
// SIG // CZImiZPyLGQBGRYDR0JMMRMwEQYKCZImiZPyLGQBGRYD
// SIG // QU1FMRUwEwYDVQQDEwxBTUUgQ1MgQ0EgMDEwggEiMA0G
// SIG // CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDJmlIJfQGe
// SIG // jVbXKpcyFPoFSUllalrinfEV6JMc7i+bZDoL9rNHnHDG
// SIG // fJgeuRIYO1LY/1f4oMTrhXbSaYRCS5vGc8145WcTZG90
// SIG // 8bGDCWr4GFLc411WxA+Pv2rteAcz0eHMH36qTQ8L0o3X
// SIG // Ob2n+x7KJFLokXV1s6pF/WlSXsUBXGaCIIWBXyEchv+s
// SIG // M9eKDsUOLdLTITHYJQNWkiryMSEbxqdQUTVZjEz6eLRL
// SIG // kofDAo8pXirIYOgM770CYOiZrcKHK7lYOVblx22pdNaw
// SIG // Y8Te6a2dfoCaWV1QUuazg5VHiC4p/6fksgEILptOKhx9
// SIG // c+iapiNhMrHsAYx9pUtppeaFAgMBAAGjggTcMIIE2DAS
// SIG // BgkrBgEEAYI3FQEEBQIDAgACMCMGCSsGAQQBgjcVAgQW
// SIG // BBQSaCRCIUfL1Gu+Mc8gpMALI38/RzAdBgNVHQ4EFgQU
// SIG // llGE4Gtve/7YBqvD8oXmKa5q+dQwggEEBgNVHSUEgfww
// SIG // gfkGBysGAQUCAwUGCCsGAQUFBwMBBggrBgEFBQcDAgYK
// SIG // KwYBBAGCNxQCAQYJKwYBBAGCNxUGBgorBgEEAYI3CgMM
// SIG // BgkrBgEEAYI3FQYGCCsGAQUFBwMJBggrBgEFBQgCAgYK
// SIG // KwYBBAGCN0ABAQYLKwYBBAGCNwoDBAEGCisGAQQBgjcK
// SIG // AwQGCSsGAQQBgjcVBQYKKwYBBAGCNxQCAgYKKwYBBAGC
// SIG // NxQCAwYIKwYBBQUHAwMGCisGAQQBgjdbAQEGCisGAQQB
// SIG // gjdbAgEGCisGAQQBgjdbAwEGCisGAQQBgjdbBQEGCisG
// SIG // AQQBgjdbBAEGCisGAQQBgjdbBAIwGQYJKwYBBAGCNxQC
// SIG // BAweCgBTAHUAYgBDAEEwCwYDVR0PBAQDAgGGMBIGA1Ud
// SIG // EwEB/wQIMAYBAf8CAQAwHwYDVR0jBBgwFoAUKV5RXmSu
// SIG // NLnrrJwNp4x1AdEJCygwggFoBgNVHR8EggFfMIIBWzCC
// SIG // AVegggFToIIBT4YxaHR0cDovL2NybC5taWNyb3NvZnQu
// SIG // Y29tL3BraWluZnJhL2NybC9hbWVyb290LmNybIYjaHR0
// SIG // cDovL2NybDIuYW1lLmdibC9jcmwvYW1lcm9vdC5jcmyG
// SIG // I2h0dHA6Ly9jcmwzLmFtZS5nYmwvY3JsL2FtZXJvb3Qu
// SIG // Y3JshiNodHRwOi8vY3JsMS5hbWUuZ2JsL2NybC9hbWVy
// SIG // b290LmNybIaBqmxkYXA6Ly8vQ049YW1lcm9vdCxDTj1B
// SIG // TUVSb290LENOPUNEUCxDTj1QdWJsaWMlMjBLZXklMjBT
// SIG // ZXJ2aWNlcyxDTj1TZXJ2aWNlcyxDTj1Db25maWd1cmF0
// SIG // aW9uLERDPUFNRSxEQz1HQkw/Y2VydGlmaWNhdGVSZXZv
// SIG // Y2F0aW9uTGlzdD9iYXNlP29iamVjdENsYXNzPWNSTERp
// SIG // c3RyaWJ1dGlvblBvaW50MIIBqwYIKwYBBQUHAQEEggGd
// SIG // MIIBmTBHBggrBgEFBQcwAoY7aHR0cDovL2NybC5taWNy
// SIG // b3NvZnQuY29tL3BraWluZnJhL2NlcnRzL0FNRVJvb3Rf
// SIG // YW1lcm9vdC5jcnQwNwYIKwYBBQUHMAKGK2h0dHA6Ly9j
// SIG // cmwyLmFtZS5nYmwvYWlhL0FNRVJvb3RfYW1lcm9vdC5j
// SIG // cnQwNwYIKwYBBQUHMAKGK2h0dHA6Ly9jcmwzLmFtZS5n
// SIG // YmwvYWlhL0FNRVJvb3RfYW1lcm9vdC5jcnQwNwYIKwYB
// SIG // BQUHMAKGK2h0dHA6Ly9jcmwxLmFtZS5nYmwvYWlhL0FN
// SIG // RVJvb3RfYW1lcm9vdC5jcnQwgaIGCCsGAQUFBzAChoGV
// SIG // bGRhcDovLy9DTj1hbWVyb290LENOPUFJQSxDTj1QdWJs
// SIG // aWMlMjBLZXklMjBTZXJ2aWNlcyxDTj1TZXJ2aWNlcyxD
// SIG // Tj1Db25maWd1cmF0aW9uLERDPUFNRSxEQz1HQkw/Y0FD
// SIG // ZXJ0aWZpY2F0ZT9iYXNlP29iamVjdENsYXNzPWNlcnRp
// SIG // ZmljYXRpb25BdXRob3JpdHkwDQYJKoZIhvcNAQELBQAD
// SIG // ggIBAFAQI7dPD+jfXtGt3vJp2pyzA/HUu8hjKaRpM3op
// SIG // ya5G3ocprRd7vdTHb8BDfRN+AD0YEmeDB5HKQoG6xHPI
// SIG // 5TXuIi5sm/LeADbV3C2q0HQOygS/VT+m1W7a/752hMIn
// SIG // +L4ZuyxVeSBpfwf7oQ4YSZPh6+ngZvBHgfBaVz4O9/wc
// SIG // fw91QDZnTgK9zAh9yRKKls2bziPEnxeOZMVNaxyV0v15
// SIG // 2PY2xjqIafIkUjK6vY9LtVFjJXenVUAmn3WCPWNFC1YT
// SIG // IIHw/mD2cTfPy7QA1pT+GPARAKt0bKtq9aCd/Ym0b5tP
// SIG // bpgCiRtzyb7fbNS1dE740re0COE67YV2wbeo2sXixzvL
// SIG // ftH8L7s9xv9wV+G22qyKt6lmKLjFK1yMw4Ni5fMabcgm
// SIG // zRvSjAcbqgp3tk4a8emaaH0rz8MuuIP+yrxtREPXSqL/
// SIG // C5bzMzsikuDW9xH10graZzSmPjilzpRfRdu20/9UQmC7
// SIG // eVPZ4j1WNa1oqPHfzET3ChIzJ6Q9G3NPCB+7KwX0OQmK
// SIG // yv7IDimj8U/GlsHD1z+EF/fYMf8YXG15LamaOAohsw/y
// SIG // wO6SYSreVW+5Y0mzJutnBC9Cm9ozj1+/4kqksrlhZgR/
// SIG // CSxhFH3BTweH8gP2FEISRtShDZbuYymynY1un+RyfiK9
// SIG // +iVTLdD1h/SxyxDpZMtimb4CgJQlMYIZODCCGTQCAQEw
// SIG // WDBBMRMwEQYKCZImiZPyLGQBGRYDR0JMMRMwEQYKCZIm
// SIG // iZPyLGQBGRYDQU1FMRUwEwYDVQQDEwxBTUUgQ1MgQ0Eg
// SIG // MDECEzYAAAF+/2/9BKQlWBIAAgAAAX4wDQYJYIZIAWUD
// SIG // BAIBBQCgga4wGQYJKoZIhvcNAQkDMQwGCisGAQQBgjcC
// SIG // AQQwHAYKKwYBBAGCNwIBCzEOMAwGCisGAQQBgjcCARUw
// SIG // LwYJKoZIhvcNAQkEMSIEINabgQBFKj5k8pKwLEO2FdZ8
// SIG // is37VwYI+XnAlsNfrVn4MEIGCisGAQQBgjcCAQwxNDAy
// SIG // oBSAEgBNAGkAYwByAG8AcwBvAGYAdKEagBhodHRwOi8v
// SIG // d3d3Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAE
// SIG // ggEAQfoSUPm4TA2PjMRBLpjdxOUsSE+GrDKBUEezVCz/
// SIG // UA1AFFH88dBYnmCaol58mU8W4vRrt6kESi96rJeqXLzr
// SIG // KFjkepzP1aFAWaauU/Rb3LYfRFkrhq51bvSZsmJtHbX7
// SIG // nBZY/1RunrRZHPnnhK29rJ2wKt0Tp1fOcLn/ZjLqyD5g
// SIG // YAL1zEFPliSRQoCVjM6f75lHhGRqhXgGfT2QFbVo1hgQ
// SIG // Jfd2PCgSx4atVAF7GInFN+H57Hm4tAQtnTp+sPvRTIzL
// SIG // K6ix/xJGYmRJlDvZMAR6gwDLVERtRAw1j4J4dDJGArBj
// SIG // f4RjnEXRPS9Pn+5hI3xrwT0UiZbr/36UqCsAUKGCFwAw
// SIG // ghb8BgorBgEEAYI3AwMBMYIW7DCCFugGCSqGSIb3DQEH
// SIG // AqCCFtkwghbVAgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFR
// SIG // BgsqhkiG9w0BCRABBKCCAUAEggE8MIIBOAIBAQYKKwYB
// SIG // BAGEWQoDATAxMA0GCWCGSAFlAwQCAQUABCAIlBG4QgEp
// SIG // ZA7n0GJitcO/LHojytc2VbDJYu7SDklL1AIGYhZhExF0
// SIG // GBMyMDIyMDMyNTA0NDUwOC4xOTdaMASAAgH0oIHQpIHN
// SIG // MIHKMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSUwIwYDVQQLExxN
// SIG // aWNyb3NvZnQgQW1lcmljYSBPcGVyYXRpb25zMSYwJAYD
// SIG // VQQLEx1UaGFsZXMgVFNTIEVTTjpBRTJDLUUzMkItMUFG
// SIG // QzElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAg
// SIG // U2VydmljZaCCEVcwggcMMIIE9KADAgECAhMzAAABlklb
// SIG // YuEv3fdPAAEAAAGWMA0GCSqGSIb3DQEBCwUAMHwxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFBDQSAyMDEwMB4XDTIxMTIwMjE5
// SIG // MDUxM1oXDTIzMDIyODE5MDUxM1owgcoxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xJTAjBgNVBAsTHE1pY3Jvc29mdCBBbWVy
// SIG // aWNhIE9wZXJhdGlvbnMxJjAkBgNVBAsTHVRoYWxlcyBU
// SIG // U1MgRVNOOkFFMkMtRTMyQi0xQUZDMSUwIwYDVQQDExxN
// SIG // aWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIICIjAN
// SIG // BgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA0h9sEAtv
// SIG // rf48wOoy+i2TIQzSRtJ79XFKnvh+DBishIEWVMKdWLB5
// SIG // dSExsovCva5D0SiigItJU/ING9RiIqZFnPKgrRN8Im8a
// SIG // DUeJgsq74BLF7rZ28SNaG8fHDH2tl4HIRv1wRmXBbRnd
// SIG // FEL15MVGL6JHxtU8gTKpyGb0Ni7XJho/OpWj0TbkaHZB
// SIG // DO1VVDtqDEhyW2kzY9W9pAAvLKpcrR9c5n60KUwN62Ts
// SIG // hJssE+Nw0X7DZV5pDSjIluwWnzZx2SxhxmnKYphOHaAz
// SIG // Lq98oh/6ggsdjzuKSKpAOlixkjfMoWGr3EGURVbbJf8f
// SIG // yIri9H8TxqUJkXPOJuNcmrp3L3jYf+f9eDKrGe7oGNYs
// SIG // fH5DmICQZS7LPJsj4WjAOqnBAf0VlqnAn4cgETYwnJgT
// SIG // RjV3jICsmf/nt2wjpV5lng7VSQy5jrcxAwS5pINv3rad
// SIG // 0/YTl/i6HWMHQZGNp6AgxMz1lWvN+AJpCb0espxHgRo+
// SIG // qLlon6V8WqGwXWrG9Pq//XmK/k9NMqyxZ9eq601C51c5
// SIG // Fu5S8l1hKLrL82J7pdxzwkKKEEuC2NRwSk8k0n7Rl+em
// SIG // YDs+0ZPnrL23K/jYy7wQcu13qJoJLsNRf1K7u5WfQEfh
// SIG // EG6YNqbwh0mqzEEB239Rlz4ZQ0x8JHrJEYs+Yz4069Vs
// SIG // /3/vQmceaL7UxdECAwEAAaOCATYwggEyMB0GA1UdDgQW
// SIG // BBTS3wjZLC5lrSBhLImLhCqa0c10sjAfBgNVHSMEGDAW
// SIG // gBSfpxVdAF5iXYP05dJlpxtTNRnpcjBfBgNVHR8EWDBW
// SIG // MFSgUqBQhk5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20v
// SIG // cGtpb3BzL2NybC9NaWNyb3NvZnQlMjBUaW1lLVN0YW1w
// SIG // JTIwUENBJTIwMjAxMCgxKS5jcmwwbAYIKwYBBQUHAQEE
// SIG // YDBeMFwGCCsGAQUFBzAChlBodHRwOi8vd3d3Lm1pY3Jv
// SIG // c29mdC5jb20vcGtpb3BzL2NlcnRzL01pY3Jvc29mdCUy
// SIG // MFRpbWUtU3RhbXAlMjBQQ0ElMjAyMDEwKDEpLmNydDAM
// SIG // BgNVHRMBAf8EAjAAMBMGA1UdJQQMMAoGCCsGAQUFBwMI
// SIG // MA0GCSqGSIb3DQEBCwUAA4ICAQCvYAsQuCFW2ClUARz+
// SIG // c7SXP5H4Erm3C+YU0XlRNbsElSqfdkn3fyCLxYBkHMFZ
// SIG // QGXPA7mzoU7IZUdn0hXyuvrFM6DDrn/SLShe5t+PPkqW
// SIG // eOeYiEw8k4BI6l4U5k07wX8hBwOoMRxs1aOe/JNkLHO6
// SIG // krl5j6/GZHrkTRzTsRUUJp1FpnUzixiZWyavc0x/imG5
// SIG // yWdrSuccE9ndoq7Qbu1Pxa7swsUm5zNNMunaWGXDFAnS
// SIG // 7s8RxJ1/P3qTtZ0Ja6VE6SeoHpdj7/hPuKJLXV/M89GN
// SIG // Fn8HUDmVW5+YK/8Dy7yKHHiiSd+ugAN+pW3PA6OYek0r
// SIG // yW1QKzbrW4P9SXAk+U5faXjBJoitW98+ZERWX387VHva
// SIG // TWJ4Yo5BmkJ0U27Aal2ggi5j1PYuDxB3DsofM+7ebc4z
// SIG // gJ0GF4u6DQW0V4rc/F2zytl2rDQfUGlPtNUymUZVbWJb
// SIG // Fqw64je8QsAnMeG1J8ohxjYlea3iLAzGwime4dbMSyEH
// SIG // oObVvzIN0d9BJ84xVeXKvET176GhY/PS6RTJZiW5PPih
// SIG // Zh88F3JecEvhlct/FbpQPt+mhDOBQAyqjI1tdBQlBFVX
// SIG // 85xWd1JRnUkuxqshXqFwcxKr8GiFsb9AV7y7TT30fmMT
// SIG // s3gmnojFQt3MdD5Q3M/gBf1TdlhyiPNXTgJhP6iyZHfx
// SIG // KZi2czCCB3EwggVZoAMCAQICEzMAAAAVxedrngKbSZkA
// SIG // AAAAABUwDQYJKoZIhvcNAQELBQAwgYgxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xMjAwBgNVBAMTKU1pY3Jvc29mdCBSb290
// SIG // IENlcnRpZmljYXRlIEF1dGhvcml0eSAyMDEwMB4XDTIx
// SIG // MDkzMDE4MjIyNVoXDTMwMDkzMDE4MzIyNVowfDELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0
// SIG // IFRpbWUtU3RhbXAgUENBIDIwMTAwggIiMA0GCSqGSIb3
// SIG // DQEBAQUAA4ICDwAwggIKAoICAQDk4aZM57RyIQt5osvX
// SIG // JHm9DtWC0/3unAcH0qlsTnXIyjVX9gF/bErg4r25Phdg
// SIG // M/9cT8dm95VTcVrifkpa/rg2Z4VGIwy1jRPPdzLAEBjo
// SIG // YH1qUoNEt6aORmsHFPPFdvWGUNzBRMhxXFExN6AKOG6N
// SIG // 7dcP2CZTfDlhAnrEqv1yaa8dq6z2Nr41JmTamDu6Gnsz
// SIG // rYBbfowQHJ1S/rboYiXcag/PXfT+jlPP1uyFVk3v3byN
// SIG // pOORj7I5LFGc6XBpDco2LXCOMcg1KL3jtIckw+DJj361
// SIG // VI/c+gVVmG1oO5pGve2krnopN6zL64NF50ZuyjLVwIYw
// SIG // XE8s4mKyzbnijYjklqwBSru+cakXW2dg3viSkR4dPf0g
// SIG // z3N9QZpGdc3EXzTdEonW/aUgfX782Z5F37ZyL9t9X4C6
// SIG // 26p+Nuw2TPYrbqgSUei/BQOj0XOmTTd0lBw0gg/wEPK3
// SIG // Rxjtp+iZfD9M269ewvPV2HM9Q07BMzlMjgK8QmguEOqE
// SIG // UUbi0b1qGFphAXPKZ6Je1yh2AuIzGHLXpyDwwvoSCtdj
// SIG // bwzJNmSLW6CmgyFdXzB0kZSU2LlQ+QuJYfM2BjUYhEfb
// SIG // 3BvR/bLUHMVr9lxSUV0S2yW6r1AFemzFER1y7435UsSF
// SIG // F5PAPBXbGjfHCBUYP3irRbb1Hode2o+eFnJpxq57t7c+
// SIG // auIurQIDAQABo4IB3TCCAdkwEgYJKwYBBAGCNxUBBAUC
// SIG // AwEAATAjBgkrBgEEAYI3FQIEFgQUKqdS/mTEmr6CkTxG
// SIG // NSnPEP8vBO4wHQYDVR0OBBYEFJ+nFV0AXmJdg/Tl0mWn
// SIG // G1M1GelyMFwGA1UdIARVMFMwUQYMKwYBBAGCN0yDfQEB
// SIG // MEEwPwYIKwYBBQUHAgEWM2h0dHA6Ly93d3cubWljcm9z
// SIG // b2Z0LmNvbS9wa2lvcHMvRG9jcy9SZXBvc2l0b3J5Lmh0
// SIG // bTATBgNVHSUEDDAKBggrBgEFBQcDCDAZBgkrBgEEAYI3
// SIG // FAIEDB4KAFMAdQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYD
// SIG // VR0TAQH/BAUwAwEB/zAfBgNVHSMEGDAWgBTV9lbLj+ii
// SIG // XGJo0T2UkFvXzpoYxDBWBgNVHR8ETzBNMEugSaBHhkVo
// SIG // dHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9w
// SIG // cm9kdWN0cy9NaWNSb29DZXJBdXRfMjAxMC0wNi0yMy5j
// SIG // cmwwWgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5o
// SIG // dHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRz
// SIG // L01pY1Jvb0NlckF1dF8yMDEwLTA2LTIzLmNydDANBgkq
// SIG // hkiG9w0BAQsFAAOCAgEAnVV9/Cqt4SwfZwExJFvhnnJL
// SIG // /Klv6lwUtj5OR2R4sQaTlz0xM7U518JxNj/aZGx80HU5
// SIG // bbsPMeTCj/ts0aGUGCLu6WZnOlNN3Zi6th542DYunKmC
// SIG // VgADsAW+iehp4LoJ7nvfam++Kctu2D9IdQHZGN5tggz1
// SIG // bSNU5HhTdSRXud2f8449xvNo32X2pFaq95W2KFUn0CS9
// SIG // QKC/GbYSEhFdPSfgQJY4rPf5KYnDvBewVIVCs/wMnosZ
// SIG // iefwC2qBwoEZQhlSdYo2wh3DYXMuLGt7bj8sCXgU6ZGy
// SIG // qVvfSaN0DLzskYDSPeZKPmY7T7uG+jIa2Zb0j/aRAfbO
// SIG // xnT99kxybxCrdTDFNLB62FD+CljdQDzHVG2dY3RILLFO
// SIG // Ry3BFARxv2T5JL5zbcqOCb2zAVdJVGTZc9d/HltEAY5a
// SIG // GZFrDZ+kKNxnGSgkujhLmm77IVRrakURR6nxt67I6Ile
// SIG // T53S0Ex2tVdUCbFpAUR+fKFhbHP+CrvsQWY9af3LwUFJ
// SIG // fn6Tvsv4O+S3Fb+0zj6lMVGEvL8CwYKiexcdFYmNcP7n
// SIG // tdAoGokLjzbaukz5m/8K6TT4JDVnK+ANuOaMmdbhIurw
// SIG // J0I9JZTmdHRbatGePu1+oDEzfbzL6Xu/OHBE0ZDxyKs6
// SIG // ijoIYn/ZcGNTTY3ugm2lBRDBcQZqELQdVTNYs6FwZvKh
// SIG // ggLOMIICNwIBATCB+KGB0KSBzTCByjELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJp
// SIG // Y2EgT3BlcmF0aW9uczEmMCQGA1UECxMdVGhhbGVzIFRT
// SIG // UyBFU046QUUyQy1FMzJCLTFBRkMxJTAjBgNVBAMTHE1p
// SIG // Y3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2WiIwoBATAH
// SIG // BgUrDgMCGgMVAND6JppVWWnbirQx4Ic7QWQ35lb+oIGD
// SIG // MIGApH4wfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldh
// SIG // c2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNV
// SIG // BAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UE
// SIG // AxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAw
// SIG // DQYJKoZIhvcNAQEFBQACBQDl58GEMCIYDzIwMjIwMzI1
// SIG // MTIyMDIwWhgPMjAyMjAzMjYxMjIwMjBaMHcwPQYKKwYB
// SIG // BAGEWQoEATEvMC0wCgIFAOXnwYQCAQAwCgIBAAICIE0C
// SIG // Af8wBwIBAAICEckwCgIFAOXpEwQCAQAwNgYKKwYBBAGE
// SIG // WQoEAjEoMCYwDAYKKwYBBAGEWQoDAqAKMAgCAQACAweh
// SIG // IKEKMAgCAQACAwGGoDANBgkqhkiG9w0BAQUFAAOBgQAh
// SIG // oXk95JxrlCIwDH5XKFroExS8Q2YkaJVROCfPqtkGO7LC
// SIG // TJegszfOfr7ceG5QC4URTFgx47bVQeR8Xd6i/e+31tt2
// SIG // ToXiZIEM1xFXiI5xqmPDsmq3lq26OtUYnazYCBhrlsA8
// SIG // GjXBwwLsks7R+uUu7F/PUjpFmoCPQDVXFWRJ8TGCBA0w
// SIG // ggQJAgEBMIGTMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAk
// SIG // BgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAy
// SIG // MDEwAhMzAAABlklbYuEv3fdPAAEAAAGWMA0GCWCGSAFl
// SIG // AwQCAQUAoIIBSjAaBgkqhkiG9w0BCQMxDQYLKoZIhvcN
// SIG // AQkQAQQwLwYJKoZIhvcNAQkEMSIEIL01EAmjo95DUUg9
// SIG // QrAFEmP9KhLjufL803DJnSFSvYVuMIH6BgsqhkiG9w0B
// SIG // CRACLzGB6jCB5zCB5DCBvQQgdgTWAvgdNdOSdkcugn52
// SIG // dCQPCX5WUEOrC6RyNy2yvZAwgZgwgYCkfjB8MQswCQYD
// SIG // VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
// SIG // A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
// SIG // IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQg
// SIG // VGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAAZZJW2LhL933
// SIG // TwABAAABljAiBCDPvYB4bcFbQUrnuGJDD0ribMMtfq5D
// SIG // Yz6rN6IrHdml4jANBgkqhkiG9w0BAQsFAASCAgBC2kSp
// SIG // UHP1XCAcw7kqFfEz+MJYxHPuIWF8ZXRRhEX0r2Kwnq0m
// SIG // ssei6GjQzVnJZz3JoMEOQjOgaP436i9bqerfGTPF9Ut2
// SIG // FF60TC8J5P+GeeP0m1SWvwsg3dYPwVH/jmv5a4VLcPvO
// SIG // 9coEu3eLj37Eq/XwNqHCKAknFGeb6It0JsCygGnXzifS
// SIG // oL4zTmS6JRPQFKYChiH7y6uI5w6PbMvWUP9WKRN+IttQ
// SIG // 9SlHLKt7dsxQQMM5uBTdcU6zZYIf6gVv673eelYq1wEc
// SIG // FXIAefBe3Oe65dZ8BYuMcRZrWx1mbBC3H0X9r6QlGK1D
// SIG // H2h/ZlWOvwFJnDgKbJvsMpqr65BwMDTTvHq7jFnagFnn
// SIG // 2LOwg7D8Tf0eGpMuS5ScyaLjIBrS5BppiMrbfMbWhkyS
// SIG // 4hCw+t5Lih8q2bWtOUixQd8Is+Hw7XEzw6BGnvOCOz5T
// SIG // Spt47PHDPTTyRxyi9yk7p5NqEjJaVuABs0K82sBDJLp5
// SIG // R7AkQUgcS/nJk57n7fGPqHPzFG6tVrZcsx2+fwKezUiG
// SIG // AnLn/aH/nMN6IQszjYFc++0ifUCIToNlXOI0ivuLp/tn
// SIG // oFfGWaaAQJFFY+74DkyBRvCNHwtEwudsAlVn/eLBdemv
// SIG // so0NM6KNDXQ8wF9y1nzcLNGo22pII/DwNRvgkbScTMlS
// SIG // uqp5cQx7D+zmMk5a8w==
// SIG // End signature block
