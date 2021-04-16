# style.exchanger
This class changes the styles that defined in target' css selectors to styles that described in css selectors of sources.

Example of using

If we have 

```css
<style type="text/css">
    body div {
        background-color: activeborder;
        font-size: larger;
    }
    .color-yellow {
        color: yellow;
    }
    .bgcolor-red {
        background-color: red;
    }
    .border-3px{
        border: 3px;
        font-weight: bolder;
    }
</style>
```
then we can do 

```css
body div {
    color: yellow;
    background-color: red;
    border: 3px;
    font-weight: bolder;
}
```
an easy and without any DOM traversing and it will work for all elements of page
because it makes changes in target source of all ellements on page.

```html
<script type="text/javascript">
    (function($){
        $(document).ready(function(event){
            var styleExchanger = new StyleExchanger();
            styleExchanger
                    .add('body div','.color-yellow')
                    .add('body div','.bgcolor-red')
                    .add('body div','.border-3px')
                    .execute();
/*  same
 *                     styleExchanger
 *                            .add('body div',['.color-yellow','.bgcolor-red','.border-3px'])
 *                            .execute();
 */                    
        });
    })(jQuery)
</script>
```
