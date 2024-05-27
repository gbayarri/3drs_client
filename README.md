[![](https://readthedocs.org/projects/3drs-documentation/badge/?version=latest)](https://3drs-documentation.readthedocs.io/en/latest/?badge=latest)
[![](https://zenodo.org/badge/DOI/10.3389/fmolb.2021.726232.svg)](https://doi.org/10.3389/fmolb.2021.726232)
[![CITATION.cff](https://github.com/gbayarri/3drs_client/actions/workflows/cff-validator.yaml/badge.svg)](https://github.com/gbayarri/3drs_client/actions/workflows/cff-validator.yaml)

# 3-dimensional structure Representation Sharing

This is the front-end of the **3-dimensional structure Representation Sharing (3dRS)** web application.

<a href="https://mmb.irbbarcelona.org/3dRS"><img src="src/assets/img/logo.png" alt="3dRS" width="200"/></a>

## Config

As this Vue project has been configured to use **history mode**, an additional **.htaccess file** must be added to the root folder (e.g. replacing `RewriteBase /` with `RewriteBase /name-of-your-subfolder/`, where _/name-of-your-subfolder/_ is the folder in the server)

```apacheconf
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Links

[Visit the official website](https://mmb.irbbarcelona.org/3dRS)

[Visit the official documentation](https://3drs-documentation.readthedocs.io/en/latest/)

## Credits

Genís Bayarri, Adam Hospital.

## Copyright & licensing

This software has been developed by the [MMB group](https://mmb.irbbarcelona.org) at the [IRB Barcelona](https://irbbarcelona.org).

© 2021 **Institute for Research in Biomedicine**

Licensed under the **Apache License 2.0**.