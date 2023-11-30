# vue-permission-loader
### groups
```
{
  "production": ["production"],
  "development": ["development"]
}

```

### grants

```
<!--{{BEGIN GRANT('production')}}-->
<p>允许模式,production组的可以显示，production属于production组，显示</p>
<!--{{END GRANT}}-->
```

```
<!--{{BEGIN GRANT('development')}}-->
<p>允许模式,development组的可以显示，production不属于development组，不显示</p>
<!--{{END GRANT}}-->
```

```
/* {{BEGIN GRANT('production')}} */
//允许模式,production组的可以执行，production属于production组，执行</p>
/* {{END GRANT}} */
```
