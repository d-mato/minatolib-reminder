<?php

$Conf = parse_ini_file('conf.ini');

$authorization_url = "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id={$Conf['CLIENT_ID']}&redirect_uri={$Conf['REDIRECT_URI']}&scope={$Conf['SCOPE']}&access_type=offline";

echo "次のURLをブラウザで開き、Google Calendarへのアクセスを承認してください。\n";
echo $authorization_url."\n\n";

echo "承認後のページに表示されたコードを入力してください\n";
$code = readline();

$data = [
  'code' => $code,
  'client_id' => $Conf['CLIENT_ID'],
  'client_secret' => $Conf['CLIENT_SECRET'],
  'redirect_uri' => $Conf['REDIRECT_URI'],
  'grant_type' => 'authorization_code',
  'access_type' => 'offline'
];

$ch = curl_init('https://www.googleapis.com/oauth2/v4/token');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
file_put_contents('token.json', curl_exec($ch));

echo "token.jsonを作成しました\n";


