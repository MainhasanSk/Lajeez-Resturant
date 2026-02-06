Console Error



Error creating product: {}
app/admin/products/add/page.tsx (107:21) @ handleSubmit


  105 |
  106 |         } catch (error) {
> 107 |             console.error('Error creating product:', error);
      |                     ^
  108 |             alert('Error creating product. Check console for details.');
  109 |         } finally {
  110 |             setLoading(false);
Call Stack
4

Show 3 ignore-listed frame(s)
handleSubmit
app/admin/products/add/page.tsx (107:21)