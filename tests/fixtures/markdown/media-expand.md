## Media and Expandable Content

<!-- adf:mediaSingle layout="center" width="80" -->
<!-- adf:media id="architecture-diagram-2024" type="file" collection="project-assets" width="800" height="600" -->
![Media](adf:media:architecture-diagram-2024)

~~~expand title="Technical Implementation Details"
This section contains detailed information about the implementation:

1. Parser architecture uses `unified` and `remark`
2. ESM-only for modern compatibility
3. Converter registry system for extensibility

~~~expand title="Performance Metrics" attrs='{"nested":true}'
- Build time: **44ms**
- Test suite: **2.8s**
~~~
~~~