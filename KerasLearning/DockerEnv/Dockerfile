FROM continuumio/anaconda3:2021.05

RUN mkdir /code && \
    pip install --upgrade pip && \
    conda update conda && \
    conda install -c conda-forge tensorflow && \
    conda install -c anaconda pillow && \
    pip install flickrapi && \
    pip install python-dotenv && \
    pip install Django && \
    pip install pytz && \
    pip install django-bootstrap4

WORKDIR /code

# EXPOSE 8888
EXPOSE 8888

ENTRYPOINT ["jupyter-lab", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root", "--NotebookApp.token=''"]
CMD ["--notebook-dir=/code"]

